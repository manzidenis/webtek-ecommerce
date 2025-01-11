package com.abdoul.backend.service;

import com.abdoul.backend.entities.Order;
import com.abdoul.backend.entities.OrderProduct;
import com.abdoul.backend.entities.Product;
import com.abdoul.backend.entities.User;
import com.abdoul.backend.entities.enums.OrderStatus;
import com.abdoul.backend.repository.OrderProductRepository;
import com.abdoul.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.abdoul.backend.repository.ProductRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderProductRepository orderProductRepository;
    private final ProductRepository productRepository;

    @Autowired
    public OrderService(OrderRepository orderRepository, OrderProductRepository orderProductRepository,
            ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.orderProductRepository = orderProductRepository;
        this.productRepository = productRepository;
    }

    public List<Order> getOrdersByUser(User user) {
        return orderRepository.findByUser(user);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(UUID orderId) {
        return orderRepository.findById(orderId).orElse(null);
    }

    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }

    public List<OrderProduct> getOrderProducts(UUID orderId) {
        Optional<Order> optionOrder = orderRepository.findById(orderId);
        if (optionOrder.isPresent()) {
            Order order = optionOrder.get();
            return orderProductRepository.findByOrder(order);
        }
        return null;
    }

    public Order addProductToOrder(UUID orderId, OrderProduct orderProduct) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order != null) {
            orderProduct.setOrder(order);
            orderProductRepository.save(orderProduct);
            return order;
        }
        return null;
    }

    public Order updateOrderStatus(UUID orderId, OrderStatus status) {
        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();

            // If the status is SHIPPED or DELIVERED
            if (status == OrderStatus.SHIPPED || status == OrderStatus.DELIVERED) {
                // If the status is being updated to SHIPPED and the current status is not
                // already SHIPPED
                if (status == OrderStatus.SHIPPED && order.getStatus() != OrderStatus.SHIPPED) {
                    List<OrderProduct> orderProducts = orderProductRepository.findByOrder(order);

                    for (OrderProduct orderProduct : orderProducts) {
                        Product product = orderProduct.getProduct();
                        int orderedQuantity = orderProduct.getQuantity();

                        // Check if the product has enough stock
                        if (product.getQuantity() >= orderedQuantity) {
                            // Reduce the product quantity
                            product.setQuantity(product.getQuantity() - orderedQuantity);

                            // Save the updated product back to the database
                            productRepository.save(product);
                        } else {
                            // Handle the case where stock is insufficient (optional)
                            throw new IllegalArgumentException("Insufficient stock for product: " + product.getName());
                        }
                    }
                }

                // If the status is DELIVERED and the current status is not already DELIVERED
                // Do nothing related to quantity since it has already been reduced during
                // SHIPPED status.
            }

            // Update the order status
            order.setStatus(status);
            return orderRepository.save(order);
        }

        return null;
    }

}
